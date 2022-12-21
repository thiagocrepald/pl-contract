package br.com.plantaomais.entitybean;

import br.com.plantaomais.entitybean.enums.EntityStatus;
import lombok.*;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "contracting_party")
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
@Getter
@Setter
public class ContractingParty implements Serializable {

    public static final String ALIAS_CLASSE = "contrato";

    public static final String ID = "id";
    public static final String RESULTS_CENTER = "resultsCenter";
    public static final String SANKHYA_CODE = "sankhyaCode";
    public static final String NOTES = "notes";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "cnpj")
    private String cnpj;

    @OneToOne
    private Address address;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private EntityStatus status = EntityStatus.ACTIVE;

}
